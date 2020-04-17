import { useParams } from 'react-router-dom'

const useContestPublicId = () =>
  useParams<{ publicContestId: string }>().publicContestId

export default useContestPublicId
