import { NextPage } from "next";

const ClientErrorPage: NextPage = () => {
    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1 style={{ fontSize: "64px", margin: "0px" }}>
                404
            </h1>
            <h2>
                This page could not be found.
            </h2>
        </div>
    )
}

export default ClientErrorPage;