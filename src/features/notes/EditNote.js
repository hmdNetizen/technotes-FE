import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import { useGetNotesQuery } from "./notesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const EditNote = () => {
  const { id } = useParams();
  const { isAdmin, isManager, username } = useAuth();

  const { note } = useGetNotesQuery("notesList", ({ data }) => ({
    note: data?.entities[id],
  }));

  const { users } = useGetUsersQuery("usersList", ({ data }) => ({
    users: data?.ids.map((id) => data?.entities[id]),
  }));

  if (!note || !users?.length) return <PulseLoader color="#fff" />;

  if (!isAdmin || !isManager) {
    if (note.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditNoteForm note={note} users={users} />;

  return content;
};
export default EditNote;
