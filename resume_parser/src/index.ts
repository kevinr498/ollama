import axios, { AxiosResponse } from 'axios'
import * as fs from 'fs/promises'

interface GenerateRequest {
  model: string
  messages: any[]
  stream: boolean
}

async function generateData(): Promise<void> {
  const messages = await getMessagesFromFile()

  if (messages?.length) {
    // Use Promise.all to execute multiple requests concurrently
    const responses = await Promise.all(
      messages.map(async (data: any) => {
        const messageFormatted = await requestData(data)
        try {
          const response = await axios.post('http://localhost:11434/api/chat', messageFormatted)
          console.log('Finished another')
          return response
        } catch (error) {
          console.error('Error sending request:', error)
          return null
        }
      })
    )

    // Log the responses
    responses.forEach(async (response, index) => {
      if (response) {
        console.log('Response:', response.data)

        // Write each response to a separate JSON file
        const fileName = `response_${index + 1}.json`
        await fs.writeFile(fileName, JSON.stringify(response.data, null, 2))
        console.log(`Response written to ${fileName}`)
      }
    })
  }
}

async function getMessagesFromFile(): Promise<any[] | null> {
  try {
    const data = await fs.readFile('chat.json', 'utf-8')
    const messages: any[] = JSON.parse(data)
    return messages
  } catch (error: any) {
    console.error('Error reading chats.json:', error.message || error)
    return null
  }
}

// Example usage:
function requestData(data: any): GenerateRequest {
  return {
    model: 'llama2',
    stream: false,
    messages: [data],
  }
}

generateData().catch(error => {
  console.error('Error:', error.message || error)
})
