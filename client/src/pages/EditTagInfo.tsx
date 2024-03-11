import { FormEvent, useEffect, useState, useTransition } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Button from "../components/Button";
import { Spinner } from "../components/Spinner";
import { editTagThunk, getTagThunk } from "../features/tag/tagApi";
import { useForm } from "../hooks/useForm";
import { configAxios } from "../utils/configAxios";

const EditTagInfo = () => {
  const [fill, setFill] = useState<boolean>(true);

  const { tag, loading } = useAppSelector((state) => state.tag);
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { tagName } = useParams();
  const { form, handleChange, setForm } = useForm<{ infoTag: string }>();

  const [isPending, startTransition] = useTransition();

  const config = configAxios(token);

  useEffect(() => {
    if ("infoTag" in form && form.infoTag.trim() !== "") {
      setFill(false);
    } else {
      setFill(true);
    }
  }, [form]);

  useEffect(() => {
    if (tag) {
      setForm({ infoTag: tag.infoTag });
    }
  }, [tag]);

  useEffect(() => {
    const fetch = async () => {
      if (tagName) {
        dispatch(getTagThunk({ tag: tagName }));
      }
    };
    fetch();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tag) {
      dispatch(editTagThunk({ id: tag._id, infoTag: form.infoTag, config }));
    }

    startTransition(() => {
      navigate(`/questions/tagged/${tagName}`);
    });
  };

  if (!user) return <Navigate to="/" />;
  if (loading) return <Spinner />;
  return (
    <form className="m-2" onSubmit={handleSubmit}>
      <div className="flex flex-col bg-white border rounded text-slate-700 border-slate-400 my-5 p-5">
        <label htmlFor="content" className="font-semibold text-lg">
          Body
        </label>
        <textarea
          className="p-1 h-40 border border-slate-300"
          name="infoTag"
          id="infoTag"
          value={(form && form.infoTag) || ""}
          onChange={handleChange}
          autoFocus
        ></textarea>
      </div>
      <Button name={"Save edits"} disabled={fill || isPending} />
    </form>
  );
};

export default EditTagInfo;
