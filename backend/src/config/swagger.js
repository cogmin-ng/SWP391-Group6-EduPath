const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'EduPath API',
      version: '0.1.0',
      description: 'API documentation for EduPath backend',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
          required: ['email', 'password'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        RefreshRequest: {
          type: 'object',
          properties: { refreshToken: { type: 'string' } },
          required: ['refreshToken'],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        SendOtpRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
          required: ['email'],
        },
        ResendOtpRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
          required: ['email'],
        },
        VerifyOtpRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 6, maxLength: 6 },
          },
          required: ['email', 'otp'],
        },
        ForgotPasswordRequest: {
          type: 'object',
          properties: { email: { type: 'string', format: 'email' } },
          required: ['email'],
        },
        ResetPasswordRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            otp: { type: 'string', minLength: 6, maxLength: 6 },
            newPassword: { type: 'string', minLength: 8 },
          },
          required: ['email', 'otp', 'newPassword'],
        },
        OtpSendResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
              },
            },
          },
        },
        OtpVerifyResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                verified: { type: 'boolean' },
              },
            },
          },
        },
        RoleCreateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
          },
          required: ['name'],
        },
        RoleUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
          },
        },
        RoleResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            createdBy: { type: ['string', 'null'] },
            updatedBy: { type: ['string', 'null'] },
            isDeleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userCount: { type: 'integer' },
          },
        },
        RoleListResponse: {
          type: 'object',
          properties: {
            roles: {
              type: 'array',
              items: { $ref: '#/components/schemas/RoleResponse' },
            },
            total: { type: 'integer' },
          },
        },
        UserUpdateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100 },
            avatar: { type: 'string', format: 'uri' },
            bio: { type: 'string', maxLength: 500 },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING'],
            },
          },
        },
        UserRoleUpdateRequest: {
          type: 'object',
          properties: {
            roleId: { type: 'string' },
          },
          required: ['roleId'],
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: ['string', 'null'] },
            email: { type: 'string' },
            avatar: { type: ['string', 'null'] },
            bio: { type: ['string', 'null'] },
            xp: { type: 'integer' },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING'],
            },
            role: { type: ['string', 'null'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserListResponse: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserResponse' },
            },
            total: { type: 'integer' },
          },
        },
        MediaUploadResponse: {
          type: 'object',
          properties: {
            url: { type: 'string' },
            publicId: { type: 'string' },
            resourceType: { type: 'string' },
            format: { type: ['string', 'null'] },
            bytes: { type: ['integer', 'null'] },
            width: { type: ['integer', 'null'] },
            height: { type: ['integer', 'null'] },
            originalName: { type: ['string', 'null'] },
          },
        },
        MediaDeleteRequest: {
          type: 'object',
          properties: {
            publicId: { type: 'string' },
            resourceType: {
              type: 'string',
              enum: ['image', 'video', 'raw'],
              default: 'image',
            },
          },
          required: ['publicId'],
        },
        UserInfo: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: ['string', 'null'] },
            email: { type: 'string' },
            avatar: { type: ['string', 'null'] },
          },
        },
        TipSubmitRequest: {
          type: 'object',
          properties: {
            nodeId: { type: 'string' },
            title: { type: 'string', minLength: 1, maxLength: 200 },
            content: { type: 'string', minLength: 10, maxLength: 5000 },
          },
          required: ['nodeId', 'title', 'content'],
        },
        TipRejectRequest: {
          type: 'object',
          properties: {
            rejectReason: { type: 'string', minLength: 5, maxLength: 500 },
          },
          required: ['rejectReason'],
        },
        TipResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nodeId: { type: 'string' },
            title: { type: ['string', 'null'] },
            content: { type: 'string' },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
            },
            createdBy: { $ref: '#/components/schemas/UserInfo' },
            contributor: { $ref: '#/components/schemas/UserInfo' },
            reviewedBy: { type: ['string', 'null'] },
            reviewedAt: { type: ['string', 'null'], format: 'date-time' },
            rejectReason: { type: ['string', 'null'] },
            isPublished: { type: 'boolean' },
            publishedAt: { type: ['string', 'null'], format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TipListResponse: {
          type: 'object',
          properties: {
            tips: {
              type: 'array',
              items: { $ref: '#/components/schemas/TipResponse' },
            },
            total: { type: 'integer' },
          },
        },
        NotificationResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            type: {
              type: 'string',
              enum: ['SYSTEM', 'QUIZ', 'ROADMAP', 'CONTRIBUTION', 'CERTIFICATE'],
            },
            relatedTipId: { type: ['string', 'null'] },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        NotificationListResponse: {
          type: 'object',
          properties: {
            notifications: {
              type: 'array',
              items: { $ref: '#/components/schemas/NotificationResponse' },
            },
            total: { type: 'integer' },
          },
        },
        QuizOptionSchema: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            isCorrect: { type: 'boolean' },
          },
          required: ['content', 'isCorrect'],
        },
        QuizQuestionSchema: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            explanation: { type: ['string', 'null'] },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizOptionSchema' },
              minItems: 2,
            },
          },
          required: ['question', 'options'],
        },
        QuizCreateRequest: {
          type: 'object',
          properties: {
            nodeId: { type: 'string' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            passingScore: { type: 'integer', minimum: 1 },
            xpReward: { type: 'integer', minimum: 0 },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizQuestionSchema' },
              minItems: 1,
            },
          },
          required: ['nodeId', 'title', 'passingScore', 'questions'],
        },
        QuizUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            passingScore: { type: 'integer', minimum: 1 },
            xpReward: { type: 'integer', minimum: 0 },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizQuestionSchema' },
              minItems: 1,
            },
          },
          required: ['title', 'passingScore', 'questions'],
        },
        QuizOptionResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            questionId: { type: 'string' },
            content: { type: 'string' },
            isCorrect: { type: 'boolean' },
            isDeleted: { type: 'boolean' },
          },
        },
        QuizQuestionResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            quizId: { type: 'string' },
            question: { type: 'string' },
            explanation: { type: ['string', 'null'] },
            isDeleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            options: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizOptionResponse' },
            },
          },
        },
        QuizResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nodeId: { type: 'string' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            passingScore: { type: 'integer' },
            xpReward: { type: 'integer' },
            isDeleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            questions: {
              type: 'array',
              items: { $ref: '#/components/schemas/QuizQuestionResponse' },
            },
          },
        },
        CertificateResponse: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            learningPathTitle: { type: 'string' },
            mentorName: { type: 'string' },
            issuedAt: { type: 'string', format: 'date-time' },
            certificateUrl: { type: ['string', 'null'] },
            verificationId: { type: 'string' },
          },
        },
        CertificateVerifyResponse: {
          type: 'object',
          properties: {
            valid: { type: 'boolean' },
            learningPath: { type: 'string' },
            mentor: { type: 'string' },
            issueDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'OTP',
        description: 'One-time password email verification endpoints',
      },
      {
        name: 'Role',
        description: 'Role management endpoints',
      },
      {
        name: 'User',
        description: 'User management endpoints',
      },
      {
        name: 'Media',
        description: 'Media upload endpoints',
      },
      {
        name: 'Tip',
        description: 'Tip contribution and management endpoints',
      },
      {
        name: 'Notification',
        description: 'Notification management endpoints',
      },
      {
        name: 'Quiz',
        description: 'Quiz management endpoints for mentors',
      },
      {
        name: 'Certificate',
        description: 'Certificate management and verification endpoints',
      },
    ],
  },
  apis: [
    './src/routes/auth.js',
    './src/routes/upload.js',
    './src/routes/role.js',
    './src/routes/user.js',
    './src/routes/tip.js',
    './src/routes/notification.js',
    './src/routes/quiz.js',
    './src/routes/certificate.js',
    './src/routes/otp.js',
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
