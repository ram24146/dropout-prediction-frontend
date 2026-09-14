import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const predictSingle = async (student) => {
  const { data } = await api.post('/predict', student)
  return data
}

export const predictBatch = async (students) => {
  const { data } = await api.post('/predict/batch', { students })
  return data
}

export const getFeatureImportance = async () => {
  const { data } = await api.get('/feature-importance')
  return data.importances
}

export const checkHealth = async () => {
  const { data } = await api.get('/health')
  return data
}