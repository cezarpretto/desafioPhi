import { login, save, __RewireAPI__ as Users } from './Users'
const user = { email: 'cezarolipretto@gmail.com', password: '7C4A8D09CA3762AF61E59520943DC26494F8941B'}

describe('Users Test', () => {
  beforeEach(() => {
    Users.__ResetDependency__('pool')
  })

  it('Should return User on login success', async () => {
    const expected = {
      name: 'Cezar Pretto',
      email: 'cezarolipretto@gmail.com',
      token: 'Bearer: mockedToken'
    }

    Users.__set__('createToken', () => 'Bearer: mockedToken')

    Users.__get__('pool').getConnection = async () => {
      return {
        query: async () => {
          return [{
            name: 'Cezar Pretto',
            email: 'cezarolipretto@gmail.com'
          }]
        },
        release: async () => {
          return
        }
      }
    }
    const response = await login(user)
    await expect(response).toEqual(expected)
  })

  it('Should throw Wrong email or password when no one row was returned', async () => {
    const expected = 'Wrong email or password'

    Users.__get__('pool').getConnection = async () => {
      return {
        query: async () => {
          return []
        },
        release: async () => {
          return
        }
      }
    }
    expect(login(user)).rejects.toThrow(expected)
  }) 

  it('Should throw error when the user is already registered', async () => {

    Users.__get__('pool').getConnection = async () => {
      return {
        query: async (string) => {
          if (!string.match(/(^start|^commit|^rollback)/im)) {
            let err = new Error('Duplicate entry')
            err.errno = 1062
            throw err
          }

          return
        },
        release: async () => {
          return
        }
      }
    }
    const expected = 'This user is already registered'
    const user = { name: 'João da silva', email: 'joao@joao.com', password: '123456' }
    await expect(save(user))
      .rejects
      .toThrow(expected)
  }) 
})