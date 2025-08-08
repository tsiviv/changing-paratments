import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import CurrentApartment from './cuurentApartment';
import CurrentDesireApartment from './currentDesireApartment';
import CurrentpersonallDetails from './currentpesonallDetails';
import '../styles/personallArea.css'
import config from '../config';

const UserProfile = () => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // השתמש ברידוסר הנכון
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    const baseURL=config.baseUrl


    // פונקציה לפענוח טוקן JWT
    return (
        <div>
            {isAuthenticated ?
                (
                    <div className='mt-0'>
                        <div className="name-container d-flex justify-content-center flex-column align-items-center mb-3">
                            <div className="d-flex justify-content-between align-items-center gap-5 mb-2 pt-2">
                                <img _ngcontent-c7="" alt="" class="avatar" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAHMAAABWCAYAAAD8IqljAAAABHNCSVQICAgIfAhkiAAABLZJREFUeF7tnS9w1UAQxvccEolEIpFIJBKJRCKRyMrKSuSTlZWVlZWVlZWVlXXLfG8uTAhJNptc8rL3vpthhmn30r39Ze/v7iUJSygLqOobEfkiIh9EBP9/FJG7lNJzCtUSKiuq+lVEPnZM8ZJSuiLMYC+Iqv7KHtnVnDCDsYRnXgzofKBnBqNJmMGAjalLmIRZkQUqago9kzArskBFTaFn1gXzh4i86zYppXTBpUkw0KqKbbxvHbVvU0r3hBkMJtRV1bci8j7vBD1hXxY/J8yAMIdUJkzCrMgCFTWFnkmYFVlgpabkSQrOHbGMwCFyt7yKCCYuj80EZqkq9MylFuypn0H+dDz6kFJ6csj3ihLmUgv2w/wsIvg3tTyklG6mCnM2u9RSjvqq+j2vA6fWwlrxMFWYMJdaylFfVemZDnvtWjSPmdhD7Zv49E2EMGYed3GWFI6ZS6w3UjeHRH6a8HiMly8T5EwRwjRNFEeAMOOwMjUlTNNEcQQIMw4rU1PCNE0UR4Aw47AyNSVM00RxBAgzDitTU8I0TRRHgDDjsDI1JUzTRHEECDMOK1NTwjRNFEeAMOOwMjUlTNNEcQQIMw4rU1PCNE0UR4Aw47AyNQ0NU1WRCYXQDGRFIdgYgcWIP0Vg8YPZ+soEQsJsXTnWvamqjQcBUtel4msicI8Kszd7uMfgAIrIN3hs9SUcTFXFJYBTot4aeOhyr6snGS3ZNnevyOGYEo/a5ve7RFzq3l+IUJ45kM8/xca4wvNuimBkmWgwvWH/Z9XVngvMIok5e/faaDAx8cEEyFvuU0q33krR5KPBxOaAJ4m14YH1Jq6/rrqEggkSM3Ifj1deV00xN84NU1WbHH0YqUj2ksfQznQ5PPosliVoqAumqmL7DBe+o2BXpUheoQdm9k68UMhOHltvQr+bc+heG/t5YWK8wrjVlJNNLHo+CdF+J7DJjrXl5j2H98UsKe+F2b3sfRdT/lbXLyVu7Shp4C2fVQXMLQ22579FmHum49SNMJ0G27M4Ye6ZjlM3wnQabM/ihLlnOk7dCNNpsLZ4Xus2l9+/nvoA/AizvU4z2oZdl3ZBjM2U04iTbP0t4DRYtXX1KHbD2hsoTR1EB+Kips2jA5Oqzj1W8tgKW2s4uVh8Dafnj5aWdd6Jh90nbCdu1mbAHPoeY2lbhA2syt0pPj+BOF1v2WzLkzANNBkkhpf/PgzjoAoPXb3bZTdrw/SGdg49schtz2PqcgI0Yp2c/tCd9Dkc8h/R1Q/JuTQZh9n3se65MFFv1e6WMMdhDn3feS7QVSeBhDmApXAX+/ev4Gt6c98Eqx5hDsOcG3Bt2fxyrUQmwtwe5moBZoS5MUx2s1bHtcLvVxozsRl/uYK6x0fSM4c9c270/BirVQPgvDB3E2q51tvdfu6M6HlLrV2tM9snLCcLgrYsVur3C/JB+1SAva7Wmsm6u1lUyGef6IKezyHIWFVxWoKPdi8tq3rlLJhLWxStfqFTkyJf4bNs5xozrYfV+vvcG1m5LUPN3wQkPdPx9mUPxcb71C4XYyQOpje7S4Ge6QCa5wzNrWBDUAERib2bJy4RphNmZ+kCsJgMHieEIoIzy8WfTpyr0h8sELw+r2gnJQAAAABJRU5ErkJggg=="></img>
                                <div class="avatar__img"></div>
                                <img _ngcontent-c7="" alt="" class="avatar" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAHMAAABWCAYAAAD8IqljAAAABHNCSVQICAgIfAhkiAAABLFJREFUeF7tnSFw3TAMhiU2ODg4ODg4ODg4ODg4ODg4WFhYWFhYWFhYWFhYWFhYpt3/zu8ul8Uvlp+dyLZ89269m+In6Yv9YllWWETeEdE3IvpERPj7iYjumfmFvDXlARaR70T0eab1KzNfNmWJK0uA+SeMyLk7Lpn51X3UjgcA829E3Wtmfm7HFNfUYXZ0DzhMh9mRBzoyxUemw+zIAx2Z4iOzM5i/iOjD3CZmji1ZOjK/L1MwMhHG+zEz646ZH/oytX9rGCaKyHsi+hgiQc8el20T/AGmtz484DD74HiwwmE6zI480JEpRUZm2OD+QkR4kMJnqWEHBg9XvhNT6QY6G2YA+TuyJ7qk9i0zP1ayZ+huS8DEiETaSWrD6LxOFXa5dA+UgPmViPBJbZ6SkuoppVwJmD4ylU6vJV4CJjL6EN+NPfjMdb9hZmQAeivsgbNhQp/wEIQMP4A91Z48VFiY4KS7IjDrqec9azzgMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi7rMI0D0qjnMDXeMi47HEwRwWk3pLjgX+QtodYRPo+t5/MOA3NSVm5ejWw63pBtj7OpTZaaGwkmDhTjYPFaeyOiqxarkw0BU0SGyO0dBWasPuCpUdpcubnuYYYHnp9rc+vC/z8w813GdbtdMgJM7VmYI4zmDjg5zPg4cpi7zTGRL46UxklRE0cpblIErciMMDJx/gUPQNrW3KHg7mGCYKR0+Sm4iAhhrYk1ZzNtFJgYnZqj+rscOwxRqkPpu5zaD0PADKMTTkIUaO0c6S7TawA5PeeKWPGtZloYBmYAihGKaBA+87OkKJqBteUucVkRQcwYb7KYtgvNVD8UzKmXQr3AwyjNmdI0IyZFVkSW1sOqKNSwMFMcvKWMw9zS25W/y2FWdvCW3TvMLb1d+bscZmUHb9m9w9zS25W/q3mY0+UBkqpaTNUoxbhJmGGzGIv2Y034qT8QC0X1rt0W76XgHPuZhuhW+kbQYJ5shs3x1SDGcZ282TpTRBBOQ4Tjv9duRIxERAaZck0Fu2eBCW0putx76bBdtwnMEKpCGdO1cmxzY3BXIla6enfmeqHmdRmJZOeoc1kdZhiRCCDntmZTH7uCmVElOgb8hZmvcu+Gva5b2AmppUr9aTZjU/iUsU2+BamLB6Cw7MCGcKnWdQVp00uTSr8Xqi2hUnfRFv1Yh4nEY6wlS7Z7Zr4v2aGVvqzDxBS7lqKh9WVz6Y+pBlqHWeP9m80lJvcCc/Elq6nGReR8ZJ5wYLWggYj4b6bizrU+zeYe2Dnlgl3SIBVMskWtw0RA/Zww3twxb8x8ke0t4xeaT7UsPNV2uyzBfWY+CbpAkP04npo8+6GdDAJQrM0xC6lfTVntAehoSGT60NiJXRNEfprcBtMYeq5sdZhhCllKvU/RHSDx0OPvDkvw1iYwA1CUbUGmQeoGddMb0wm+Ly6yGczJjzzyfzBSY6E+QEQOkL/9Vol7U5hT3SaZeYcf/JC4hE3oZnN+lL4vLv4PrMW/gPCM3fgAAAAASUVORK5CYII="></img>
                            </div>
                            <p className="profile__content mb-0">{user?.username}</p>
                        </div>


                        <div className='container p-5'>
                            <CurrentpersonallDetails />

                            <CurrentApartment />

                            <CurrentDesireApartment />
                        </div>
                    </div>

                ) : <></>
            }
        </div >
    );
};

export default UserProfile;