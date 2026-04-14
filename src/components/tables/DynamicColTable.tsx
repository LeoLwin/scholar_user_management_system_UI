
import { useState, useEffect } from "react";
import DataTable from "@/components/tables/DataTable";
import { getAttendanceByBatchId } from "@/api/batchService";
import Notification from "@/components/ui/notification/Notification";
import Checkbox from "@/components/form/input/Checkbox";

const DynamicColTable = () => {
	const [attendance, setAttendance] = useState< any[]>([]);
	const [loading, setLoading] = useState(true);
	const [dates, setDates] = useState([]);

	const columns = [
    { key: "studentName", header: "Student Name", render: (x: any) => x.studentName },
		{ key: "attendanceRate", header: "%", render: (x: any) => x.attendanceRate },
		...dates?.map((data, index) => ({
			key: `date_${index}`,
			header: data?.date,
			render: (x: any) => {
				console.log(x.attendance[index]);
				return (<Checkbox 
					checked={x.attendance[index]?.status || false} 
					onChange={() => changeAttendance(x.attendance[index].id, x.attendance[index].date, !x.attendance[index].status)}
				/>)
			},
		}
		),
		
		),
  ];
	
	useEffect(() => {
		fetchData()
  }, []);

	useEffect(() => {
		console.log('dates', dates);
  }, [dates]);

	useEffect(() => {
		console.log(attendance)
  }, [attendance]);

	const changeAttendance = (attendanceId: number, date: string, status: boolean, ) => {
		console.log(attendanceId, date, status);

		// setAttendance((prev) =>
		// 	prev.map((student) =>
		// 		student.studentId === studentId
		// 			? {
		// 					...student,
		// 					status: student.status.map((val: boolean, i: number) =>
		// 						i === index ? status : val
		// 					),
		// 				}
		// 			: student
		// 	)
		// );
	}

	const fetchData = async () => {
    setLoading(true);
    try{
      const result: any = await getAttendanceByBatchId(1);
			console.log('data', result.data);
      if (result.status === "success") {
        setAttendance(result.data);
				console.log(result.data[0])
				setDates(result.data[0].attendance?? []);
      } else {
        Notification(
          result.status as "success" | "error" | "warning",
          result.status,
          result.message,
        );
      }
    }finally{
      setLoading(false);
    }
  };
  return(
		<>
		<DataTable
				columns={columns}
				data={attendance}
				sortCols={[]}
				isPagination = {false}
				onChangeParam={() => {}}
				totalEntries={0}
				totalPages={0}
				page={1}
				loading={loading}
			/>
		</>
	)
}

export default DynamicColTable;