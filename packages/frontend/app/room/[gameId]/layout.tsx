const RoomLayout = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            header
            <div>left</div>
            <div>right</div>
            <div>{children}</div>
        </div>
    );
};

export default RoomLayout;
