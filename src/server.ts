import { app } from './app'
import { env } from './config/env'

app.listen(env.PORT, () => {
  console.log(`Your server is alive!! 🚀 
  💻 Running on port: ${env.PORT}`)
})
