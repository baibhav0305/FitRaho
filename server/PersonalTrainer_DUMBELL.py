import  cv2 as cv
import numpy as np
import Pose_Detection_Module as pdm
import time
import math


class Dumbell:
    def open():
        cap=cv.VideoCapture(0, cv.CAP_DSHOW)
        ptime=0
        dir=0
        count=0


        pose=pdm.poseDetector()


        time1=time.time()

        while True:
            success,img=cap.read()
            img = cv.resize(img, (1280, 720))
            img=pose.findPose(img)

            lmlist=pose.findPosition(img,draw=False)

            if len(lmlist)!=0:
                #Right Arm
                angle=pose.findAngle(img,12,14,16)
                angle1=pose.findAngle(img,11,13,15)
                per=np.interp(angle,(210,310),(0,100))
                bar = np.interp(angle, (220, 310), (650, 100))
                #check for  dummbell curl

                color = (255, 0, 255)
                if per == 100 :
                    color = (0, 255, 0)
                    if dir == 0:
                        count += 0.5
                        dir = 1
                if per == 0 :
                    color = (0, 255, 0)
                    if dir == 1:
                        count += 0.5
                        dir = 0 
                
                # Draw Bar
                cv.rectangle(img, (1100, 100), (1175, 650), color, 3)
                cv.rectangle(img, (1100, int(bar)), (1175, 650), color, cv.FILLED)
                cv.putText(img, f'{int(per)} %', (1100, 75), cv.FONT_HERSHEY_PLAIN, 4,
                            color, 4)
                # Draw Curl Count
                cv.rectangle(img, (0, 450), (250, 720), (0, 255, 0), cv.FILLED)
                cv.putText(img, str(int(count)), (45, 670), cv.FONT_HERSHEY_PLAIN, 15,
                            (255, 0, 0), 25)

            ctime=time.time()
            f=1/(ctime-ptime)
            ptime=ctime
            cv.putText(img,str(int(f)),(10,70),cv.FONT_HERSHEY_DUPLEX,3,(255,0,60),3)
            cv.imshow("img",img)
            cv.waitKey(1)
            
            #cv.destroyAllWindows()
            if time.time()-time1>30:
                break 
        return math.floor(count)
