import { useParams } from 'react-router-dom'

const useContestOwnerId = () => useParams<{ contestId: string }>().contestId

export default useContestOwnerId
