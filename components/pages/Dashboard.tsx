import Link from "next/link";

const Dashboard = () => {
    return (
        <div>
            {/* TODO: Replace this temporary link with an actual UI  */}
            <Link href="/create-list">
                <a>Create List</a>
            </Link>
        </div>
    )
}

export default Dashboard;