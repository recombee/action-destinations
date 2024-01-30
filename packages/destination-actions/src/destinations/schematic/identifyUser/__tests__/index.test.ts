import nock from 'nock'
import { createTestEvent, createTestIntegration } from '@segment/actions-core'
import Destination from '../../index'

const testDestination = createTestIntegration(Destination)

const SCHEMATIC_API_KEY = 'test'

const identify_mapping = {
  user_keys: {
    email: 'example@example.com'
  }
}

const auth = {
  refreshToken: 'xyz321',
  accessToken: 'abc123',
  apiKey: SCHEMATIC_API_KEY
}

const settings = {
  instanceUrl: 'https://api.schematichq.com',
  apiKey: SCHEMATIC_API_KEY
}

describe('POST identify call', () => {
  beforeEach(() => {
    nock(`${settings.instanceUrl}`)
      .post('/events')
      .reply(201, {
        data: {
          api_key: '<string>',
          body: {},
          captured_at: '2023-11-07T05:31:56Z',
          company_id: '<string>',
          enriched_at: '2023-11-07T05:31:56Z',
          environment_id: '<string>',
          feature_id: '<string>',
          id: '<string>',
          loaded_at: '2023-11-07T05:31:56Z',
          processed_at: '2023-11-07T05:31:56Z',
          processing_status: '<string>',
          sent_at: '2023-11-07T05:31:56Z',
          subtype: '<string>',
          type: '<string>',
          updated_at: '2023-11-07T05:31:56Z',
          user_id: '<string>'
        },
        params: {}
      })
    nock(`${settings.instanceUrl}`).post('/events').reply(400, { error: '<string>' })
  })

  it('should update a user', async () => {
    const event = createTestEvent({
      type: 'identify',
      userId: '3456',
      traits: {
        email: 'homer@simpsons.com',
        name: 'simpson',
        age: 42,
        source: 'facebook'
      }
    })

    const responses = await testDestination.testAction('identifyUser', {
      event,
      settings,
      auth,
      mapping: identify_mapping
    })

    expect(responses[0].status).toBe(201)
  })
})
