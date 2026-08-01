const axios = require("axios");


const askAi = async (messages) => {

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",

      {
        model: "deepseek/deepseek-r1-distill-llama-70b",

        messages,

        temperature: 0.2
      },

      {
        headers: {

          Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
          "application/json",

          "HTTP-Referer":
          "http://localhost:5173",

          "X-Title":
          "RankUp AI"

        },

        timeout:60000
      }
    );


    let content =
    response.data.choices[0].message.content;


    content =
    content.replace(
      /<think>[\s\S]*?<\/think>/gi,
      ""
    );


    return content.trim();



  } catch(error){

    console.log(
      "OpenRouter Error:",
      error.response?.data ||
      error.message
    );


    throw error;

  }

};





const analyzeResumeWithAI = async(resumeText)=>{


const prompt = `

You are an expert ATS resume analyzer.


Analyze this resume and return ONLY JSON.



FORMAT:


{
 "resumeRole":"",
 "experience":"",
 "projects":[],
 "skills":[]
}



RULES:


resumeRole:

- Identify the strongest professional profile from the resume.
- This is only for resume analysis.
- Do not change user's selected interview role.



experience:

- If no professional experience exists return "Fresher".
- Otherwise return years of experience.



projects:

- Return maximum 3 strongest projects.

- Each project must contain:

category:
A strong domain name describing the project.

name:
Actual project name.



Example:

[
 {
  "category":"AI/ML Engineering",
  "name":"Crop Disease Prediction System"
 }
]



Category examples:

- Full Stack Development
- Backend Engineering
- AI/ML Engineering
- Data Science
- Computer Vision
- Cloud Engineering



skills:

Return ONLY top 5-8 important technical skills.


Select skills based on:

1. Resume role
2. Projects
3. Industry relevance


Do NOT include:

- DSA
- OOP
- DBMS
- Operating Systems
- Time Complexity
- Soft skills



Resume:

${resumeText}



Return only JSON.

`;



const response = await askAi([

{
 role:"user",
 content:prompt
}

]);



console.log(
"RAW AI RESPONSE:",
response
);



try{


const cleaned =
response
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();



return JSON.parse(cleaned);



}catch(error){


console.log(
"JSON ERROR:",
error.message
);



return {

resumeRole:"",
experience:"",
projects:[],
skills:[]

};


}



};





module.exports={

askAi,

analyzeResumeWithAI

};
