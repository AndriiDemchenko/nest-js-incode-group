function throwFormattedError(msg: string): never {
	throw new Error(`[Environment error] ${msg}`)
}

export function env(key: string, defaultValue?: string): string {
	const value = process.env[key] ?? defaultValue

	if (!value) {
		throwFormattedError(`'${key}' is missing`)
	}

	return value
}

env.boolean = (key: string) => {
	const value = env(key)

	if (value === 'true') {
		return true
	}

	if (value === 'false') {
		return false
	}

	throwFormattedError(`'${key}' is not a boolean`)
}

env.number = (key: string) => {
	const value = +env(key)

	if (!Number.isFinite(value)) {
		throwFormattedError(`'${key}' is not a number`)
	}

	return value
}

env.array = (key: string): string[] => {
	const value = env(key)

	try {
		const array = JSON.parse(value.replace(/'/g, '"'))
		if (!Array.isArray(array)) {
			throwFormattedError(`'${key}' is not an array`)
		}

		return array
	} catch (err) {
		throwFormattedError(
			`'${key}' is not an valid array. Details: ${err.message}`,
		)
	}
}
