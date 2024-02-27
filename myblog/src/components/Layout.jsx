import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout=()=>{
  return (
    <main>
      <Header></Header>
      <Outlet></Outlet>
    </main>
  );
}
export default Layout;