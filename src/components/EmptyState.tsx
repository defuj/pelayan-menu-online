import React from "react";
interface Props {
  title? : string;
  desc? : string; 
  wrapHeight? : boolean; 
  imageWidth? : string
  icon? : string;
  minHeight? : string;
}
const EmptyState = React.memo(({
  icon = require('../assets/icons/empty-menu.svg'),
  title = '', 
  desc = 'Belum ada menunya nih,</br>Silahkan tambahkan terlebih dahulu!', 
  wrapHeight = false, 
  imageWidth = '148px',
  minHeight = '10px'
} : Props) => {
    return (
        <div style={{minHeight: minHeight}} className={wrapHeight ? 'container-empty d-flex justify-content-center align-items-center flex-column flex-fill py-5' : 'container-empty d-flex justify-content-center align-items-center flex-column flex-fill'}>
          <img src={icon} alt="empty" title="empty" className="img-empty mx-5 my-4" style={{width: `${imageWidth}`}}/>
          <div className="empty-text text-center">
            {title !== '' && <p className="headline6 color-green900 semibold m-0 px-3" id="title-not-found" dangerouslySetInnerHTML={{__html:title.toString()}}></p>}
            <p style={{maxWidth: '300px'}} className="bodytext1 color-green800 semibold mx-auto px-3" id="desc-not-found" dangerouslySetInnerHTML={{__html:desc.toString()}}></p>
          </div>
        </div>
    );
})
export default EmptyState;