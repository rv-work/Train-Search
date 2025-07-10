import { createContext , useState ,  } from "react";

const context = createContext(null)


export const Provider = ({children}) => {

    const [direct, setDirect] = useState([]);
    const [multi, setMulti] = useState([]);
    const [fromStation, setFromStation] = useState({});
    const [toStation, setToStation] = useState({});
    const [date, setDate] = useState(null);
    const [mode, setMode] = useState("");
    const [loading , setLoading] = useState(false);
    const [multiLoading , setMultiLoading] = useState(false);
    const [search , setSearch] = useState(false);
    const [error , setError] = useState("")
    const [isSearching, setIsSearching] = useState(false);


  return (
    <context.Provider value={{isSearching , setIsSearching  , multiLoading , setMultiLoading ,  direct , setDirect , multi , setMulti, fromStation , setFromStation , toStation , setToStation , loading , setLoading , search , setSearch , date ,setDate , mode , setMode , error , setError}}  >
      {children}
    </context.Provider>
  )
}

export default context