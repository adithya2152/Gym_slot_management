 
import "@/styles/admin-layout.css"

export default function AdminDash({
    children,
    calender,
    totalmem,
    totaltrainer,
    totalSlots,
   
}:
{
    children: React.ReactNode;
    calender: React.ReactNode;
    totalmem: React.ReactNode;
    totaltrainer: React.ReactNode;
    totalSlots: React.ReactNode;
    
})
{
    return (
        <div>
            {children}

            <div className="Admin_grid">
                <div className="item1 ">{calender}</div>
                <div className="item2" >{totalmem}</div>
                <div className="item3">{totaltrainer}</div>
                <div className="item4">{totalSlots}</div>
            </div>
        </div>
    )
}