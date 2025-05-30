const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middleware/auth");
const paginate = require("../middleware/paginate");

// GET /cards?skip=0&limit=10
router.get("/", auth(["READ"]), paginate, async (req, res) => {
  const cards = await prisma.card.findMany({
    skip: req.pagination.skip,
    take: req.pagination.take,
    include: { tasks: true },
  });
  res.json(cards);
});

// POST /cards
// POST /cards
router.post("/", auth(["WRITE"]), async (req, res) => {
    // 🔍 Afișează corpul requestului primit
    console.log("BODY primit:", req.body);
  
    const { boardId, title } = req.body;
  
    try {
      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });
  
      if (!board) {
        return res.status(400).json({ error: "Board does not exist." });
      }
  
      const card = await prisma.card.create({
        data: { title, boardId },
      });
  
      console.log("Card creat:", card); // opțional
      res.status(201).json(card);
    } catch (err) {
      console.error("Eroare la crearea cardului:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  

// PATCH /cards/:id
router.patch("/:id", auth(["WRITE"]), async (req, res) => {
  try {
    const card = await prisma.card.update({
      where: { id: +req.params.id },
      data: req.body,
    });
    res.json(card);
  } catch {
    res.status(404).json({ error: "Card not found" });
  }
});

// DELETE /cards/:id
router.delete("/:id", auth(["WRITE"]), async (req, res) => {
  try {
    await prisma.card.delete({ where: { id: +req.params.id } });
    res.sendStatus(204);
  } catch {
    res.status(404).json({ error: "Card not found" });
  }
});

module.exports = router;
