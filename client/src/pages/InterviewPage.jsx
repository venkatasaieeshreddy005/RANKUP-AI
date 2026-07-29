import React, { useState } from 'react'

function InterviewPage() {

    const [step,setStep]=useState(1);
    const [interviewData,setInterviewData]=useState(null)


  return (
    <div className='min-h-screen bg-gray-50'>


        {step===1 && (
            <Step1SetUp onStart={(data)=>{
                setInterviwData(data);
                setStep(2)
            }}/>
        )}

        {step===2 && (
            <Step2Interview interviewData={interviewData}
            onFinish={(report) => {setInterviwData (report);
            setStep(2)
            }}
            />
            )}


        {step===3 && (
        <Step3Report />
        )}

        
      
    </div>
  )
}

export default InterviewPage
