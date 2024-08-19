import userRepository from "../repositories/user.repository.js";
import { statusCode } from "../utils/statusCode.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
    
    async save(data) {
        try {
            const exist = await userRepository.findOne(data.email);
            if(exist)
                return { status: statusCode.CONFLICT, message: "Email Already Exists!"};
            const user = await userRepository.save(data);
            return { status: statusCode.OK, message: 'User Created', data: user  }
        } catch (error) {
            throw { status: statusCode.BAD_GATEWAY, message: error.message }
        }
    }

    async login(data) {
        try {
            const user = await userRepository.findOne(data.email);
            if(!user)
                return { status: statusCode.NOT_FOUND, message: "User Not Found"};
            const ispassCorrect = await bcrypt.compare(data.password, user.password);
            if(!ispassCorrect)
                return { status: statusCode.BAD_REQUEST, message: "Invalid Password"};
            const token = jwt.sign(
                {id: user.id, name: `${user.name}`, role: user.role},
                process.env.JWT_SECRET, { expiresIn: '4h' }
            )
            return { status: statusCode.OK, message: 'Login Success', data: token };
        } catch (error) {
            return { status: statusCode.BAD_GATEWAY, message: error.message }
        }
    }

    async update(id, data) {
        try {
            const user = await userRepository.getById(id);
            if (!user) {
                return { status: statusCode.NOT_FOUND, message: "User Not Found" };
            }
            const updatedUser = await userRepository.update(id, data);
            return { status: statusCode.OK, message: "User Updated.", data: updatedUser };
        } catch (error) {
            return { status: statusCode.BAD_GATEWAY, message: error.message };
        }
    }

    async remove(id) {
        try {
            const user = await userRepository.getById(id);
            if(!user)
                return { status: statusCode.NOT_FOUND, message: "User Not Found"};
            await userRepository.remove(id);
            return { status: statusCode.OK, message: "User Removed!" };
        } catch (error) {
            return { status: statusCode.BAD_GATEWAY, message: error.message }
        }
    }
}

export default new UserService();