import { useEffect, useState } from "react";
import Button from "./Button";
import { IoSearch } from "react-icons/io5";

const Searching = (props) => {
  const [search, setSearch] = useState("");
  const { data, setData, type, allData, serverSearching, button } = props;


  const handleSearch = (event) => {
    event.preventDefault();

    let searchValue = search ? search : event?.target?.value?.toLowerCase();
    // let searchValue = event.target.value.toLowerCase();
    if (type === "client") {
      if (searchValue) {
        const filteredData = data.filter((item) => {
          return Object.keys(item).some((key) => {
            if (key === "_id" || key === "updatedAt" || key === "createdAt") {
              return false;
            }
            const itemValue = item[key]?.toString()?.toLowerCase(); // Convert item value to lowercase
            const searchValue = search?.toLowerCase(); // Convert search value to lowercase
            return itemValue?.includes(searchValue); // Use includes() instead of indexOf()
          });
        });
        setData(filteredData);
      } else {
        setData(allData);
      }
    } else {
      serverSearching(searchValue);
    }
  };

  useEffect(() => {
    if (search?.length === 0) {
      setData(allData)
    }
  }, [search])

  return (
    <>
      <div className="searchButton">
        <div className="inputData d-flex">
          <input
            type="search"
            id="search"
            placeholder="Searching for..."
            value={search}
            className="bg-none m0-top"
            onChange={
              button
                ? (e) => setSearch(e.target.value)
                : (e) => handleSearch(e)
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
          />
          <div className='bg-theme p15-x midBox searchIcon' onClick={handleSearch}>
            <IoSearch />
          </div>
        </div>
      </div>
    </>
  );
};

export default Searching;
