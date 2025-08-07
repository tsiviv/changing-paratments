def checkWinner(arr):
    for i in arr:
        if i!="white":
            return False
    return True
def checkPostion(arrGuess,secretNumbers):
    newarr1=arrGuess.sort()
    newarr2=secretNumbers.sort()
    arrMarks=[]
    i=0
    j=0
    while(i!=4):
        if newarr1[i]==secretNumbers[j]:
            arr.append('white')
            i+=1
            j+=1
        if newarr1[i]>secretNumbers[j]:
            j+=1
        else:
            i+=1
    return arr
def CowsandBulls(secretNumbers):
    gaming=True
    while(gaming):
        arrGuess=[]
        for i in range(0,4):
            arrGuess.append(input())
        arrMarks=checkPostion(arrGuess,secretNumbers)
        if checkWinner(arrMarks):
            print("winner")
            gaming=False
        else:
            for i in arrMarks:
                print(i)
CowsandBulls([1,2,3,4])
print('fi')