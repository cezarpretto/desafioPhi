import { isValidStatus, rentMovie, returnMovie, __RewireAPI__ as Rent } from './Rent'

describe('Rent tests', () => {
  beforeEach(() => {
    Rent.__ResetDependency__('getMovie')
    Rent.__ResetDependency__('updateRentStatus')
  })

  it('Should return true when status is rented', () => {
    expect(isValidStatus('rented')).toBe(true)
    expect(isValidStatus('RENTED')).toBe(true)
  })

  it('Should return true when status is returned', () => {
    expect(isValidStatus('returned')).toBe(true)
    expect(isValidStatus('RETURNED')).toBe(true)
  })

  it('Should return false when status is different of returned or rented', () => {
    expect(isValidStatus('invalid_status')).toBe(false)
  })

  it('Should return false when status is empty', () => {
    expect(isValidStatus('')).toBe(false)
  })

  it('Should return false when status is undefined', () => {
    expect(isValidStatus()).toBe(false)
  })

  it('Should return void when the movie was succesfuly rent', async () => {
    Rent.__set__('getMovie', async () => {
      return {
        totalRemaining: 3
      }
    })

    Rent.__set__('updateRentStatus', async () => {
      return
    })
    await expect(rentMovie({ user: { id: 1 }, idMovie: 3 })).resolves.toBeUndefined()
  })

  it('Should throw when all copies have already been rented', async () => {
    Rent.__set__('getMovie', async () => {
      return {
        totalRemaining: 0
      }
    })

    Rent.__set__('updateRentStatus', async () => {
      return
    })
    const expected = 'All copies of the movie have already been rented'
    await expect(rentMovie({ user: { id: 1 }, idMovie: 3 })).rejects.toThrow(expected)
  })

  it('Should return void when the movie was succesfuly returned', async () => {
    Rent.__set__('updateRentStatus', async () => {
      return
    })
    await expect(returnMovie({ user: { id: 1 }, idMovie: 3 })).resolves.toBeUndefined()
  })
})