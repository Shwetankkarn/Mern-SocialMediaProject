class ApiResponse<t= unknown> {
    public statusCode: number;
    public data: t;
    public message: string;
    public success: boolean;
    constructor(statusCode: number, data, message: string){
        this.statusCode = statusCode;
        this.data= data;
        this.message= message;
        this.success= statusCode <400;
    }
}

export { ApiResponse };