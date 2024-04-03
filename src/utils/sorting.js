export const sortRequests = (a, b) => {
    if (a.createdAt > b.createdAt) return 1
    else if (b.createdAt > a.createdAt) return -1
    return 0
}
