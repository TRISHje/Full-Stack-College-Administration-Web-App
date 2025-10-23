import React, { useRef } from 'react'
import './Notice.css'
import nxticon from '../../assets/next-icon.png'
import bckicon from '../../assets/back-icon.png'

const Notice = () => {
    const slider= useRef();
    let tx=0;
    const slideforward = ()=> {
        if(tx>-50){
            tx-=25;
        }
        slider.current.style.transform=`translateX(${tx}%)`;
    }
    const slidebackward= ()=> {
        if(tx<0){
            tx+=25;
        }
        slider.current.style.transform=`translateX(${tx}%)`;
    } 

    return (
        <div className='cams-notice-section'> {/* Renamed class here */}
            <img src={nxticon} alt="" className='cams-next-btn' onClick={slideforward}/> {/* Renamed class here */}
            <img src={bckicon} alt="" className='cams-back-btn' onClick={slidebackward}/> {/* Renamed class here */}
            <div className="cams-slider"> {/* Renamed class here */}
                <ul ref={slider}>
                    <li>
                        <div className="cams-slide"> {/* Renamed class here */}
                            <div className="cams-info-box"> {/* Renamed class here */}
                                <div>
                                    <h3>B.tech Admissions open for 2025</h3>
                                </div>
                            </div>
                            <p>Starts from September 2nd</p>
                            <p>Ends on September 30th</p>
                        </div>
                    </li>

                    <li>
                        <div className="cams-slide"> {/* Renamed class here */}
                            <div className="cams-info-box"> {/* Renamed class here */}
                                <div>
                                    <h3>Fee payment deadline for B.sc programs</h3>
                                </div>
                            </div>
                            <p>Last date for fee payment is September 15</p>
                        </div>
                    </li>

                    <li>
                        <div className="cams-slide"> {/* Renamed class here */}
                            <div className="cams-info-box"> {/* Renamed class here */}
                                <div>
                                    <h3>New Courses launched for B.tech</h3>
                                </div>
                            </div>
                            <p>New courses are added for B.tech program check the courses section</p>
                        </div>
                    </li>

                    <li>
                        <div className="cams-slide"> {/* Renamed class here */}
                            <div className="cams-info-box"> {/* Renamed class here */}
                                <div>
                                    <h3>Deadline extended for BCA program</h3>
                                </div>
                            </div>
                            <p>Application deadline for BCA admission extended till October 5th</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Notice;