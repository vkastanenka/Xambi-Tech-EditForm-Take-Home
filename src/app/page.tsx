// components
import { Card } from '@/components/card'
import { EditPatientForm } from '@/components/edit-patient-form'

export default function Home() {
  return (
    <div className="flex justify-center items-center h-[100vh] px-[20px] md:px-[40px]">
      <div className="w-full md:w-[768px]">
        <Card>
          <EditPatientForm />
        </Card>
      </div>
    </div>
  )
}
