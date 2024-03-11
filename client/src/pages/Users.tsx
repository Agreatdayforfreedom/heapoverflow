import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import CardUserInfo from "../components/CardUserInfo";
import Pagination from "../components/Pagination";
import { getUsersThunk } from "../features/user/userApi";
import { Spinner } from "../components/Spinner";

const Users = () => {
  return (
    <div>
      <div className="p-5 ">
        <h1 className="text-2xl font-semibold mb-2 text-slate-700">Users</h1>
      </div>
      <UsersSection />
    </div>
  );
};

const UsersSection = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();

  const [limit, setLimit] = useState<number>(20);
  const [skip, setSkip] = useState<number>(0);
  const { loading, total, users } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersThunk({ limit, skip }));
    console.log(users);
  }, [limit, skip]);

  useEffect(() => {
    if (currentQueryParameters.get("skip")) {
      setSkip(parseInt(currentQueryParameters.get("skip")!, 10));
    }
  }, [currentQueryParameters]);

  if (loading) return <Spinner />;
  return (
    <section>
      <div className="grid xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 m-5">
        {users.map((user) => (
          <CardUserInfo key={nanoid()} user={user} image="w-12 h-12" />
        ))}
      </div>
      <Pagination limit={limit} items={total} skip={skip} />
    </section>
  );
};

export default Users;
