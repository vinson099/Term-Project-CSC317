const db = require("./db.js")
const products = [
  {
    name: "1000-Qubit Quantum Processor",
    price: 2500000.00,
    description: "High-performance quantum processor with 1000 qubits for advanced computing",
    image: "https://cdn.mos.cms.futurecdn.net/eRpdQmXhxFEXgqkFE4xB7-1600-80.jpg.webp"
  },
  {
    name: "Silicon Quantum Processor",
    price: 1200000.00,
    description: "State-of-the-art silicon-based quantum processor for reliable quantum computing",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ6lbb5RtIVSHx9OZ3lrM0ifTKpER1n6HJPw&s"
  },
  {
    name: "IBM Eagle 127-Qubit Chip",
    price: 1800000.00,
    description: "IBM's breakthrough 127-qubit quantum processor for complex computations",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmgjR-vmx4X1TXnEyhSmJ_TUpX44gklOgu7w&s"
  },
  {
    name: "Google Willow 70-Qubit Chip",
    price: 2000000.00,
    description: "Google's advanced 70-qubit quantum processor for research and development",
    image: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1vAP8i.img?w=634&h=407&m=6"
  },
  {
    name: "2-Qubit Silicon Logic Module",
    price: 450000.00,
    description: "Compact 2-qubit module for quantum logic operations and testing",
    image: "https://www.pbs.org/wgbh/nova/media/images/trap-hed.width-2500.jpg"
  },
  {
    name: "Majorana 1 Topological Qubit",
    price: 3200000.00,
    description: "Revolutionary topological qubit design for enhanced quantum stability",
    image: "https://azure.microsoft.com/en-us/blog/quantum/wp-content/uploads/2025/02/majorana1_1260x708_v2.jpg"
  },
  {
    name: "Bristlecone 72-Qubit Processor",
    price: 1600000.00,
    description: "Google's 72-qubit processor for quantum supremacy experiments",
    image: "https://assets.newatlas.com/dims4/default/3d65f97/2147483647/strip/true/crop/782x521+72+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2Farchive%2Fgoogle-bristlecone-3.png"
  },
  {
    name: "Rigetti 19Q Superconducting Processor",
    price: 850000.00,
    description: "Rigetti's 19-qubit superconducting quantum processor for practical applications",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mEywTyIBapC0mYeR9wHeYkk9358GarCMGA&s"
  },
  {
    name: "Willow 105-Qubit Chip",
    price: 2100000.00,
    description: "Advanced 105-qubit quantum processor for complex quantum algorithms",
    image: "https://media.datacenterdynamics.com/media/images/Google_Willow.original.png"
  },
  {
    name: "Next-Gen Quantum CPU Module",
    price: 950000.00,
    description: "Next-generation quantum CPU module for enhanced processing capabilities",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu_7a87HGwTKDWDsOdDlgenDJo-M4WbRHJPg&s"
  },
  {
    name: "Quantum Dilution Refrigerator",
    price: 4500000.00,
    description: "High-performance dilution refrigerator for quantum computing systems",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW1AC04pBcavz4rld5XQQkys8wDTlXrjvtpA&s"
  },
  {
    name: "Majorana 1 Qubit Control Module",
    price: 3000000.00,
    description: "Advanced control module for Majorana qubit operations",
    image: "https://lifelineit.net/wp-content/uploads/Quantum-Computing-Mobile.jpg"
  }
];

db.serialize(() => {
  // First, clear the existing data
  db.run("DELETE FROM store", (err) => {
    if (err) {
      console.error("Error clearing store table:", err.message);
      return;
    }
    console.log("Store table cleared successfully");

    // Then insert the new data
    const stmt = db.prepare("INSERT INTO store (name, price, description, image) VALUES (?, ?, ?, ?)");
    
    products.forEach(product => {
      stmt.run(
        product.name,
        product.price,
        product.description,
        product.image,
        function(err) {
          if (err) {
            console.error("Error inserting product:", product.name, err.message);
          } else {
            console.log("Successfully inserted:", product.name);
          }
        }
      );
    });
    
    stmt.finalize();
  });
});