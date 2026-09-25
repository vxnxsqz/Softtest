const express = require("express");
const jwt = require("jsonwebtoken");
const { students, courses, registrations } = require("./data");
const { authenticate, SECRET } = require("./middleware/auth");

const app = express();
app.use(express.json());

app.get("/", (req,res) => res.json({name:"Student Registration API",version:"1.0.0",purpose:"Software Testing with Postman"}));
app.get("/api/health", (req,res) => res.status(200).json({status:"UP"}));

app.post("/api/auth/login", (req,res) => {
  const {username,password}=req.body || {};
  if(!username || !password) return res.status(400).json({error:"VALIDATION_ERROR",message:"Username and password are required"});
  if(username!=="student" || password!=="123456") return res.status(401).json({error:"INVALID_CREDENTIALS",message:"Invalid username or password"});
  const token=jwt.sign({username,role:"student"},SECRET,{expiresIn:"1h"});
  res.status(200).json({message:"Login successful",token});
});

app.get("/api/students/:id", authenticate, (req,res)=>{
  const student=students.find(s=>s.studentId===req.params.id);
  if(!student) return res.status(404).json({error:"STUDENT_NOT_FOUND",message:"Student not found"});
  res.status(200).json(student);
});

app.get("/api/courses/:id", authenticate, (req,res)=>{
  const course=courses.find(c=>c.courseId===req.params.id);
  if(!course) return res.status(404).json({error:"COURSE_NOT_FOUND",message:"Course not found"});
  res.status(200).json(course);
});

app.post("/api/registrations", authenticate, (req,res)=>{
  const {studentId,courseId}=req.body || {};
  if(!studentId || !courseId) return res.status(400).json({error:"VALIDATION_ERROR",message:"studentId and courseId are required"});
  const student=students.find(s=>s.studentId===studentId);
  if(!student) return res.status(404).json({error:"STUDENT_NOT_FOUND",message:"Student not found"});
  if(student.status!=="ACTIVE") return res.status(400).json({error:"STUDENT_INACTIVE",message:"Student status must be ACTIVE"});
  const course=courses.find(c=>c.courseId===courseId);
  if(!course) return res.status(404).json({error:"COURSE_NOT_FOUND",message:"Course not found"});
  if(course.enrolled>=course.capacity) return res.status(409).json({error:"COURSE_FULL",message:"Course is full"});
  const duplicate=registrations.find(r=>r.studentId===studentId && r.courseId===courseId);
  if(duplicate) return res.status(409).json({error:"DUPLICATE_REGISTRATION",message:"Student already registered for this course"});
  const newTotalCredits=student.totalCredits+course.credits;
  if(newTotalCredits>22) return res.status(400).json({
    error:"CREDIT_LIMIT_EXCEEDED",message:"Total credits cannot exceed 22",
    currentCredits:student.totalCredits,courseCredits:course.credits,attemptedTotal:newTotalCredits,maximumCredits:22
  });
  const registration={registrationId: Math.max(0,...registrations.map(r=>r.registrationId))+1,studentId,courseId};
  registrations.push(registration); student.totalCredits=newTotalCredits; course.enrolled++;
  res.status(201).json({message:"Registration successful",...registration,credits:course.credits,totalCredits:student.totalCredits});
});

app.get("/api/registrations/:studentId", authenticate, (req,res)=>{
  const student=students.find(s=>s.studentId===req.params.studentId);
  if(!student) return res.status(404).json({error:"STUDENT_NOT_FOUND",message:"Student not found"});
  const result=registrations.filter(r=>r.studentId===req.params.studentId);
  res.status(200).json({studentId:req.params.studentId,total:result.length,registrations:result});
});

app.delete(
  "/api/test/registrations/:studentId/:courseId",
  (req, res) => {

    const { studentId, courseId } = req.params;

    const index = registrations.findIndex(
      r =>
        r.studentId === studentId &&
        r.courseId === courseId
    );

    if (index === -1) {
      return res.status(404).json({
        error: "REGISTRATION_NOT_FOUND",
        message: "Registration not found"
      });
    }

    const student = students.find(
      s => s.studentId === studentId
    );

    const course = courses.find(
      c => c.courseId === courseId
    );

    // ลบ registration
    registrations.splice(index, 1);

    // คืนหน่วยกิต
    if (student && course) {
      student.totalCredits -= course.credits;
      course.enrolled -= 1;
    }

    return res.status(200).json({
      message: "Registration reset successfully",
      studentId,
      courseId,
      totalCredits: student?.totalCredits,
      enrolled: course?.enrolled
    });
  }
);

app.use((req,res)=>res.status(404).json({error:"ENDPOINT_NOT_FOUND",message:"API endpoint not found"}));
module.exports=app;
