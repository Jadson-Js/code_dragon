import swaggerJSDoc, { type Options } from "swagger-jsdoc";
import { env } from "@/shared/env";

const fallbackServerUrl = `http://localhost:${env.serverPort}`;

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Code Dragon API",
      version: "1.0.0",
      description: "Documentacao OpenAPI da API Code Dragon.",
    },
    servers: [
      {
        url: env.serverUrl || fallbackServerUrl,
        description: "Servidor principal",
      },
    ],
    tags: [
      { name: "Auth", description: "Endpoints de autenticacao" },
      { name: "Profiles", description: "Endpoints de perfil" },
    ],
    components: {
      securitySchemes: {
        accessTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description:
            "Cookie httpOnly com JWT de acesso. Necessario nos endpoints protegidos por authAccess.",
        },
        refreshTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description:
            "Cookie httpOnly com JWT de refresh. Necessario no endpoint authRefresh.",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Invalid access token" },
          },
          required: ["status", "message"],
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "validation_error" },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "object",
              additionalProperties: {
                type: "array",
                items: { type: "string" },
              },
              example: {
                email: ["Invalid email"],
                password: ["Too small: expected string to have >=8 characters"],
              },
            },
          },
          required: ["status", "message", "errors"],
        },
        SignupRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              example: "Magnus",
            },
            email: {
              type: "string",
              format: "email",
              example: "magnus@email.com",
            },
            password: { type: "string", minLength: 8, example: "12345678" },
          },
          required: ["name", "email", "password"],
        },
        LoginRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "magnus@email.com",
            },
            password: { type: "string", minLength: 8, example: "12345678" },
          },
          required: ["email", "password"],
        },
        EmailRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "magnus@email.com",
            },
          },
          required: ["email"],
        },
        TokenRequest: {
          type: "object",
          properties: {
            token: {
              type: "string",
              minLength: 1,
              example: "jwt-or-verification-token",
            },
          },
          required: ["token"],
        },
        ResetPasswordRequest: {
          type: "object",
          properties: {
            token: { type: "string", minLength: 1, example: "reset-token" },
            password: {
              type: "string",
              minLength: 8,
              example: "newpassword123",
            },
          },
          required: ["token", "password"],
        },
        LoginResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "1e7d80d8-4f67-42ba-8a4d-a6ef3a5f8cb4",
            },
          },
          required: ["id"],
        },
        GetMeResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            isVerified: { type: "boolean" },
            hasProfile: { type: "boolean" },
          },
          required: ["id", "name", "email", "isVerified", "hasProfile"],
        },
        CreateProfileRequest: {
          type: "object",
          properties: {
            ageRangeId: { type: "integer", example: 1 },
            seniorityId: { type: "integer", example: 2 },
            specialtyId: { type: "integer", example: 3 },
            careerObjectiveId: { type: "integer", example: 4 },
            stacksId: {
              type: "array",
              items: { type: "integer" },
              minItems: 1,
              example: [1, 5, 8],
            },
          },
          required: [
            "ageRangeId",
            "seniorityId",
            "specialtyId",
            "careerObjectiveId",
            "stacksId",
          ],
        },
        CreateProfileResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        LookupItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["id", "name", "description"],
        },
        SimpleLookupItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
          },
          required: ["id", "name"],
        },
        OnboardingOptionsResponse: {
          type: "object",
          properties: {
            seniorities: {
              type: "array",
              items: { $ref: "#/components/schemas/LookupItem" },
            },
            specialties: {
              type: "array",
              items: { $ref: "#/components/schemas/LookupItem" },
            },
            careerObjectives: {
              type: "array",
              items: { $ref: "#/components/schemas/LookupItem" },
            },
            ageRanges: {
              type: "array",
              items: { $ref: "#/components/schemas/SimpleLookupItem" },
            },
            stacks: {
              type: "array",
              items: { $ref: "#/components/schemas/SimpleLookupItem" },
            },
          },
          required: [
            "seniorities",
            "specialties",
            "careerObjectives",
            "ageRanges",
            "stacks",
          ],
        },
        ProfileMeResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            linkedinUrl: { type: "string", nullable: true },
            githubUrl: { type: "string", nullable: true },
            portfolioUrl: { type: "string", nullable: true },
            ageRangeId: { type: "integer", nullable: true },
            seniorityId: { type: "integer", nullable: true },
            specialtyId: { type: "integer", nullable: true },
            careerObjectiveId: { type: "integer", nullable: true },
            stackIds: {
              type: "array",
              items: { type: "integer" },
            },
          },
          required: [
            "id",
            "userId",
            "linkedinUrl",
            "githubUrl",
            "portfolioUrl",
            "ageRangeId",
            "seniorityId",
            "specialtyId",
            "careerObjectiveId",
            "stackIds",
          ],
        },
      },
    },
    paths: {
      "/api/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Criar conta",
          description: "Registra o usuario e dispara email de verificacao.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Mensagem de retorno (sempre generica por seguranca).",
              content: {
                "application/json": {
                  schema: { type: "string" },
                  example:
                    "If this email is not registered, you will receive a verification email.",
                },
              },
            },
            "400": {
              description: "Erro de validacao de entrada.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "500": {
              description: "Erro interno.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Retornar usuario autenticado",
          security: [{ accessTokenCookie: [] }],
          responses: {
            "200": {
              description: "Dados do usuario autenticado.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/GetMeResponse" },
                },
              },
            },
            "401": {
              description: "Access token ausente ou invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/resend-verification": {
        post: {
          tags: ["Auth"],
          summary: "Reenviar email de verificacao",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmailRequest" },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Mensagem de retorno (sempre generica por seguranca).",
              content: {
                "application/json": {
                  schema: { type: "string" },
                  example:
                    "If this email is registered and not yet verified, you will receive a verification email.",
                },
              },
            },
            "400": {
              description: "Erro de validacao de entrada.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/verify-email": {
        post: {
          tags: ["Auth"],
          summary: "Verificar email",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Email validado com sucesso.",
              content: {
                "application/json": {
                  schema: { type: "string" },
                  example: "This email has been verified successfully.",
                },
              },
            },
            "400": {
              description: "Token invalido ou payload invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/forgot-password": {
        post: {
          tags: ["Auth"],
          summary: "Solicitar recuperacao de senha",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EmailRequest" },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Mensagem de retorno (sempre generica por seguranca).",
              content: {
                "application/json": {
                  schema: { type: "string" },
                  example:
                    "If this email is registered and verified, you will receive a password reset email.",
                },
              },
            },
            "400": {
              description: "Erro de validacao de entrada.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/reset-password": {
        post: {
          tags: ["Auth"],
          summary: "Redefinir senha",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Senha redefinida com sucesso.",
              content: {
                "application/json": {
                  schema: { type: "string" },
                  example: "Password reset successfully.",
                },
              },
            },
            "400": {
              description: "Token invalido ou payload invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Realizar login",
          description:
            "Autentica usuario por email/senha e devolve cookies httpOnly de access e refresh token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description:
                "Login com sucesso. Cookies accessToken e refreshToken sao enviados no Set-Cookie.",
              headers: {
                "Set-Cookie": {
                  description:
                    "Define os cookies httpOnly accessToken e refreshToken.",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            "400": {
              description: "Erro de validacao de entrada.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Credenciais invalidas.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Realizar logout",
          description:
            "Revoga sessao com base no refreshToken e limpa cookies de autenticacao.",
          security: [{ accessTokenCookie: [] }],
          responses: {
            "204": {
              description: "Logout concluido sem corpo de resposta.",
              headers: {
                "Set-Cookie": {
                  description:
                    "Limpa os cookies accessToken e refreshToken no cliente.",
                  schema: { type: "string" },
                },
              },
            },
            "401": {
              description: "Access token ou refresh token ausente/invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Atualizar token de acesso",
          security: [{ refreshTokenCookie: [] }],
          responses: {
            "200": {
              description:
                "Token atualizado. Novos cookies accessToken e refreshToken sao enviados.",
              headers: {
                "Set-Cookie": {
                  description:
                    "Atualiza os cookies accessToken e refreshToken no cliente.",
                  schema: { type: "string" },
                },
              },
            },
            "401": {
              description: "Refresh token ausente/invalido ou sessao expirada.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/profiles/onboarding-options": {
        get: {
          tags: ["Profiles"],
          summary: "Listar opcoes de onboarding",
          security: [{ accessTokenCookie: [] }],
          responses: {
            "200": {
              description: "Lista de opcoes para montar onboarding/perfil.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/OnboardingOptionsResponse",
                  },
                },
              },
            },
            "401": {
              description: "Access token ausente ou invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/profiles/me": {
        get: {
          tags: ["Profiles"],
          summary: "Retornar perfil do usuario logado",
          security: [{ accessTokenCookie: [] }],
          responses: {
            "200": {
              description: "Perfil do usuario autenticado.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProfileMeResponse" },
                },
              },
            },
            "401": {
              description: "Access token ausente ou invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/profiles": {
        post: {
          tags: ["Profiles"],
          summary: "Criar perfil",
          security: [{ accessTokenCookie: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProfileRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Perfil criado com sucesso.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateProfileResponse",
                  },
                },
              },
            },
            "400": {
              description: "Erro de validacao de entrada.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            "401": {
              description: "Access token ausente ou invalido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "429": {
              description: "Limite de requisicoes excedido.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "500": {
              description: "Erro interno.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
