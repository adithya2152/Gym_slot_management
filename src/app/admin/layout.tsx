import ResponsiveAppBar from "@/components/adminNav";

export default function Adminlayout({
    children,
}:
{
    children: React.ReactNode;
})
{
    return(
        <div>
            <ResponsiveAppBar />
             {children}
        </div>
    )
}