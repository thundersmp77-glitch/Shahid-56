import { getUser } from '@/src/lib/auth'
import { ProfileForm } from './ProfileForm'

export default async function AdminProfilePage() {
  const user = await getUser()

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
        <p className="text-zinc-400 mt-2">Update your admin credentials.</p>
      </div>
      
      <ProfileForm user={user} />
    </div>
  )
}
