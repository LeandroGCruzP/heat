import axios from 'axios'

type TypeAccessTokenResponse = {
  access_token: string
}

type TypeUserResponse = {
  id: number
  name: string
  login: string
  avatar_url: string
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token'

    const { data: accesTokenResponse } =
      await axios.post<TypeAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      })

    const response = await axios.get<TypeUserResponse>(
      'https://api.github.com/user',
      {
        headers: {
          authorization: `Bearer ${accesTokenResponse.access_token}`
        }
      }
    )

    return response.data
  }
}

export { AuthenticateUserService }
