import { checkToken, __RewireAPI__ as JWT } from './Jwt'

describe('JWT Tests', () => {
  it('Should throw Token is required when token is not present', async () => {
    await expect(checkToken()).rejects.toThrow(new Error('Token is required'))
  })

  it('Should throw Token is invalid when token is invalid', async () => {
    await expect(checkToken('Bearer: 454545455')).rejects.toThrow(new Error('Token is invalid'))
  })

  it('Should throw Token is expired when token is expired', async () => {
    const token = 'Bearer: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDk4NTE1MzUsImV4cCI6MTYwOTg1MTUzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.VjpU80J1aH8m__t43cShzW6OhIujZPFY4sVZyxxHa4s'
    await expect(checkToken(token)).rejects.toThrow(new Error('Token is expired'))
  })

  it('Should throw Token is invalid when token does not exists on DB', async () => {
    const token = 'Bearer: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDk4NTE1MzUsImV4cCI6MTY0MTM4NzUzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.lyMIsoVJ6MSc_oN4Aetw96wG1TKczE5KCEV3hJG4TqQ'
    JWT.__set__('getToken', () => Promise.reject(new Error('Token is invalid')))
    await expect(checkToken(token)).rejects.toThrow(new Error('Token is invalid'))
  })

  it('Should throw Token is expired when token has status disabled', async () => {
    const token = 'Bearer: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDk4NTE1MzUsImV4cCI6MTY0MTM4NzUzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.lyMIsoVJ6MSc_oN4Aetw96wG1TKczE5KCEV3hJG4TqQ'
    JWT.__set__('getToken', () => Promise.reject(new Error('Token is expired')))
    await expect(checkToken(token)).rejects.toThrow(new Error('Token is expired'))
  })

  it('Should resolve when is a valid token', async () => {
    const token = 'Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjA5OTQwODExLCJleHAiOjYzNDM1ODA4MTF9.qZjdd0xXq6siCWDDJQQ4upRgDgkXQGYHfBUCJSSPicM'
    JWT.__set__('getToken', () => Promise.resolve())
    const expected = {
      id: 1,
      name: 'Cezar Pretto',
      email: 'cezarolipretto@gmail.com'
    }
    const response = await checkToken(token)
    await expect(response).toEqual(expected)
  })
})