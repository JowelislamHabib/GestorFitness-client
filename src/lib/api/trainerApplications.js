const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createTrainerApplication = async (applicationData) => {
    const res = await fetch(`${baseUrl}/trainer-applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
    });
    return res.json();
};

export const getTrainerApplications = async (status = null) => {
    let url = `${baseUrl}/trainer-applications`;
    if (status) {
        url += `?status=${status}`;
    }
    const res = await fetch(url);
    return res.json();
};

export const updateTrainerApplicationStatus = async (id, status, feedback = "") => {
    const res = await fetch(`${baseUrl}/trainer-applications/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, feedback }),
    });
    return res.json();
};
