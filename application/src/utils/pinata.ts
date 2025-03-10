export const uploadToPinata = async (base64Image: string, name: string) => {
  try {
    // Convert base64 to blob
    const response = await fetch(`data:image/png;base64,${base64Image}`);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append('file', blob, `${name}.png`);

    // Prepare metadata
    const metadata = JSON.stringify({
      name: name,
    });
    formData.append('pinataMetadata', metadata);

    // Upload to Pinata
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_PINATE_JWT_TOKEN}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error uploading to Pinata');
    }

    // Return the IPFS CID
    return {
      cid: data.IpfsHash,
      url: `${import.meta.env.VITE_PINATA_GATEWAY}/ipfs/${data.IpfsHash}`,
    };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
}; 