import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from "@clerk/clerk-react"
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const { getToken } = useAuth()
    const { user } = useUser()

    const [allCourses, setallCourses] = useState([])
    const [isEducator, setisEducator] = useState(false)
    const [enrolledCourses, setenrolledCourses] = useState([])
    const [userData, setuserData] = useState(null)
    const [enrolledStudents, setenrolledStudents] = useState()

    //Fetch all courses
    const fetchAllCourses = async () => {

        try {
            const { data } = await axios.get(backendUrl + '/api/course/all')

            console.log(data)

            if (data.success) {
                setallCourses(data.courses)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch UserData
    const fetchUserData = async () => {

        if (user.publicMetadata.role === 'educator') {
            setisEducator(true)
        }

        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers:
                    { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setuserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(data.message)
        }
    }

    //Function to calculate the avg rating of a course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    //Function to calculate coursechapter time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    //Function to calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0;

        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    //Function to calculate number of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        })
        return totalLectures
    }

    // Fetch user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setenrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    const logToken = async () => {
        console.log(await getToken());

    }

    useEffect(() => {
        if (user) {
            logToken()
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

      const fetchEnrolledStudents = async () => {
        try {
          const token = await getToken()
          const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students',
            { headers: { Authorization: `Bearer ${token}` } }
          )
    
          if (data.success) {
            setenrolledStudents(data.enrolledStudents.reverse())
          } else {
            toast.error(data.message)
          }
    
        } catch (error) {
          toast.error(error.message)
        }
      }



    const value = {
        currency,
        allCourses,
        navigate, calculateRating,
        isEducator, setisEducator,
        calculateChapterTime, calculateCourseDuration, calculateNoOfLectures,
        enrolledCourses, fetchUserEnrolledCourses, backendUrl,
        userData, setuserData, getToken, fetchAllCourses,fetchEnrolledStudents,
        enrolledStudents
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}