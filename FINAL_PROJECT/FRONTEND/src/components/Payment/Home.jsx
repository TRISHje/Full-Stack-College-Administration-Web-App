/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Link } from 'react-router-dom';


export default function Home () {

  return (
   <>
   <div>ADMIN</div>
    <Link className="btn btn-primary" to="admin/getFees">Fees</Link>
    <Link className="btn btn-primary" to="admin/getInstallment">Installment</Link>
     <div>Student</div>
     <Link className="btn btn-primary" to="student/getFees">Fees</Link>
    <Link className="btn btn-primary" to="student/getInstallment">Installment</Link>
      </>
  );
}
