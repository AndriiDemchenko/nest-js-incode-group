import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { SwaggerConfig } from '@config/swagger'

export const RegisterSwagger = app => {
	if (SwaggerConfig.IsSwaggerEnabled === false) {
		return
	}

	const config = new DocumentBuilder()
		.setTitle('API GSI CMS')
		.addBearerAuth()
		.build()
	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('docs', app, document, {
		// https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
		swaggerOptions: {
			docExpansion: 'list',
			// Hide Models/Schemas entries
			defaultModelsExpandDepth: -1,
			// API Schema expand level
			defaultModelExpandDepth: 5,
			// Save user auth
			persistAuthorization: true,
		},
	})
}
