import React from "react";

interface Props {
    component : React.ElementType
}
const Main = ({component} : Props) => {
    const Component = component;
    return (<Component/>)
}

export default Main;
