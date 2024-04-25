import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { Repository } from "typeorm"
import * as bcrypt from "bcrypt"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const { username, name, password } = createUserDto
    if (!username || !name || !password) {
      throw new HttpException(
        "Username, password, and name cannot be null.",
        HttpStatus.BAD_REQUEST
      )
    }
    this.validateUsername(username) // user-id
    this.validatePassword(password)
    this.validateName(name) // name

    try {
      const newUser = new User()
      newUser.name = name
      newUser.username = username
      newUser.encrypted_password = await bcrypt.hash(password, 10)
      await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(newUser)
        .execute()
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new HttpException(
          "Username already exists.",
          HttpStatus.BAD_REQUEST
        )
      }
      throw new HttpException(
        "Unable to process your request at this time, please try again later.",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  validateUsername(username: string): boolean {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9]{7,29}$/
    if (!usernameRegex.test(username)) {
      throw new HttpException(
        "Username must start with a letter, can include numbers, and must be 8-30 characters long.",
        HttpStatus.BAD_REQUEST
      )
    }
    return true
  }

  validateName(name: string): boolean {
    if (!name || name.length < 1 || name.length > 40) {
      throw new HttpException(
        "Name must be between 1 and 40 characters long.",
        HttpStatus.BAD_REQUEST
      )
    }
    return true
  }

  validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%])[a-zA-Z\d@!#$%]{10,40}$/
    if (!passwordRegex.test(password)) {
      throw new HttpException(
        "Password must be 10-40 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character among @!#$%",
        HttpStatus.BAD_REQUEST
      )
    }
    return true
  }

  async findbyUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } })
  }
}
