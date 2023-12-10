import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { FC } from 'react';

interface Pros {
  open: boolean;
  text:string;
  handleClose: () => void;
  handleConfirm:()=>void;
}
const Index: FC<Pros> = ({ open,text, handleClose, handleConfirm }) => {
  
  const handleConfirmTemp=()=>{
    handleConfirm();
    handleClose();
  }
  
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div className="w-96 ">
          <DialogContent>
            <DialogContentText margin="dense">{text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={handleConfirmTemp}>确定</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};
export default Index;
