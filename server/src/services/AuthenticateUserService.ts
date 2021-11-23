import axios from 'axios'
import prismaClient from '../prisma'

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

    const { login, id, avatar_url, name } = response.data

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    return response.data
  }
}

export { AuthenticateUserService }
