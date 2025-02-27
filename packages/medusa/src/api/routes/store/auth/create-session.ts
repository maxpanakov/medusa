import { IsEmail, IsNotEmpty } from "class-validator"
import jwt from "jsonwebtoken"
import AuthService from "../../../../services/auth"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /auth
 * operationId: "PostAuth"
 * summary: "Authenticate Customer"
 * description: "Logs a Customer in and authorizes them to view their details. Successful authentication will set a session cookie in the Customer's browser."
 * parameters:
 *   - (body) email=* {string} The Customer's email.
 *   - (body) password=* {string} The Customer's password.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.auth.authenticate({
 *         email: 'user@example.com',
 *         password: 'user@example.com'
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/auth' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "password": "supersecret"
 *       }'
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/incorrect_credentials"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const validated = await validator(StorePostAuthReq, req.body)

  const authService: AuthService = req.scope.resolve("authService")
  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await authService
      .withTransaction(transactionManager)
      .authenticateCustomer(validated.email, validated.password)
  })

  if (!result.success) {
    res.sendStatus(401)
    return
  }

  // Add JWT to cookie
  const {
    projectConfig: { jwt_secret },
  } = req.scope.resolve("configModule")
  req.session.jwt = jwt.sign(
    { customer_id: result.customer?.id },
    jwt_secret!,
    {
      expiresIn: "30d",
    }
  )

  const customerService: CustomerService = req.scope.resolve("customerService")
  const customer = await customerService.retrieve(result.customer?.id || "", {
    relations: ["orders", "orders.items"],
  })

  res.json({ customer })
}

export class StorePostAuthReq {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
