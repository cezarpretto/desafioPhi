import { getMovie, __RewireAPI__ as Movies } from './Movies'

describe('Move tests', () => {
  beforeEach(() => {
    Movies.__ResetDependency__('pool')
  })

  it ('Should resolve when return a movie', async () => {
    Movies.__get__('pool').getConnection = async () => {
      return {
        query: async () => {
          return [{
            id: 1,
            title: 'Laranja Mecânica',
            synopsis: 'O jovem Alex passa as noites com uma gangue de amigos briguentos. Depois que é preso, se submete a uma técnica de modificação de comportamento para poder ganhar sua liberdade.',
            total_remaining: 2
          }]
        },
        release: async () => {
          return
        }
      }
    }

    const expected = {
      id: 1,
      title: 'Laranja Mecânica',
      synopsis: 'O jovem Alex passa as noites com uma gangue de amigos briguentos. Depois que é preso, se submete a uma técnica de modificação de comportamento para poder ganhar sua liberdade.',
      totalRemaining: 2
    }
    const response = await getMovie(1)
    expect(response).toEqual(expected)
  })

  it('Should throw an error when the movie does not exists', async () => {
    Movies.__get__('pool').getConnection = async () => {
      return {
        query: async () => {
          return []
        },
        release: async () => {
          return
        }
      }
    }

    const expected = 'The movie does not exists'
    expect(getMovie(1)).rejects.toThrow(expected)
  })
})