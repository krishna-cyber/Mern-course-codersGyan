import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { ERROR_MESSAGES, ROLES } from "../constants/constants";
import UserService from "../services/userService";
import createHttpError from "http-errors";
import { create } from "domain";

export default class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger
  ) {}

  async createUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, role } = req.body;
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      this.logger.info(`User created successfully`, user._id);
      // @ts-ignore
      const { password: pw, ...userDocument } = user._doc;
      res.status(201).json({
        result: userDocument,
        message: "User created successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getUserLists();

      res.status(200).json({
        result: users,
        message: "User list fetched successfully",
        meta: null,
      });
    } catch (error) {
      const err = createHttpError(500, "Error while fetching user list");
      next(err);
      return;
    }
  }

  async getUserDetailsById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const user = await this.userService.findUserById(id);

      if (!user) {
        res.status(404).json({
          result: null,
          message: ERROR_MESSAGES.RESOURCES_NOT_FOUND,
          meta: null,
        });
        return;
      }

      res.status(200).json({
        result: user,
        message: "User fetched successfully",
        meta: null,
      });
    } catch (error) {
      const err = createHttpError(500, "Error while fetching user details");
      next(err);
      return;
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.userService.deleteUserById(id);
      res.json({
        result: null,
        message: "User deleted successfully",
        meta: null,
      });
    } catch (error) {
      const err = createHttpError(500, "Error while deleting user");
      next(err);
      return;
    }
  }
  async updateTenantById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedUser = await this.userService.updateUserById(id, data);
      res.json({
        result: updatedUser,
        message: "User updated successfully",
        meta: null,
      });
    } catch (error) {
      const err = createHttpError(500, "Error while updating user");
      next(err);
      return;
    }
  }
}
