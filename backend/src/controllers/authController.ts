  // src/controllers/auth.controller.ts
  import { Request, Response } from "express";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  import { registerSchema, loginSchema } from "../schemas/auth/auth.schema";
  import { authRepository } from "../repositories/auth.repository";


  // Registrar usuário
  export const register = async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);

if (!parsed.success) {
  return res.status(400).json(parsed.error.format());
}

const data = parsed.data;

      const { name, email, password, gender, bloodType } = data;


      const userExists = await authRepository.findByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await authRepository.createUser({
        name,
        email,
        password: hashedPassword,
        bloodType,
        gender,
      });

      return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
      console.error("Erro no register:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  // Login

  export const login = async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
      }

      const { email, password } = parsed.data;

      const user = await authRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        { userId: user.id, role : user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login bem-sucedido",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role : user.role,
          availability: user.availability, 
          bloodType: user.bloodType,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
