import "@/styles/member-layout.css";

export default function memDash({
    children,
    bookedslots,
    goals,
    trainer,
}: {
    children: React.ReactNode;
    bookedslots: React.ReactNode;
    goals: React.ReactNode;
    trainer: React.ReactNode;
}) {
    return (
        <div className="Member_grid">
            {children}
            <div>
                <div className="item1">{bookedslots}</div>
                <div className="item2">{goals}</div>
                <div className="item3">{trainer}</div>
            </div>
        </div>
    );
}
