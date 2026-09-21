import { useState } from "react";
import Button from "../Components/ui/Button";
import Input from "../Components/ui/Input";
import Select from "../Components/ui/Select";
import Textarea from "../Components/ui/Textarea";
import Badge from "../Components/ui/Badge";
import StatusPill from "../Components/ui/StatusPill";
import Table from "../Components/ui/Table";
import Pagination from "../Components/ui/Pagination";
import Tabs from "../Components/ui/Tabs";
import Skeleton from "../Components/ui/Skeleton";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import Modal from "../Components/ui/Modal";
import ConfirmDialog from "../Components/ui/ConfirmDialog";
import FileUpload from "../Components/ui/FileUpload";
import JobCard from "../Components/ui/JobCard";
import StatCard from "../Components/ui/StatCard";
import SearchBar from "../Components/ui/SearchBar";
import FilterPanel from "../Components/ui/FilterPanel";
import ActiveFilterChips from "../Components/ui/ActiveFilterChips";
import "./Styleguide.css";

const SAMPLE_OFFRE = {
  id: 1,
  titre: "Développeur React confirmé",
  description:
    "Rejoignez une équipe produit de 8 personnes pour construire une application web de gestion de recrutement. Stack React, Node.js et PostgreSQL.",
  localisation: "Paris",
  typeContrat: "CDI",
  dateLimite: new Date(Date.now() + 2 * 864e5).toISOString(),
};

export default function Styleguide() {
  const [tab, setTab] = useState("en-attente");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [fileName, setFileName] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [chips, setChips] = useState([
    { key: "type", label: "CDI" },
    { key: "loc", label: "Paris" },
  ]);

  return (
    <div className="styleguide container container-wide">
      <div className="styleguide-title">
        <h1 className="font-serif">Guide de style — HireHub</h1>
        <p className="text-muted">
          Composants du design system, thème blanc sobre, aucune couleur hors variables.
        </p>
      </div>

      <Section title="Boutons">
        <div className="styleguide-row">
          <Button>Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="subtle">Discret</Button>
          <Button variant="danger">Destructif</Button>
          <Button variant="danger-solid">Destructif plein</Button>
          <Button variant="success">Succès</Button>
          <Button disabled>Désactivé</Button>
        </div>
        <div className="styleguide-row">
          <Button size="sm">Petit</Button>
          <Button>Normal</Button>
          <Button size="lg">Grand</Button>
        </div>
      </Section>

      <Section title="Champs de formulaire">
        <div className="styleguide-grid">
          <Input id="sg-nom" label="Nom" placeholder="Ex. Dupont" />
          <Input
            id="sg-email"
            label="Email"
            type="email"
            defaultValue="prenom@exemple.fr"
            error="Adresse email invalide."
          />
          <Select id="sg-type" label="Type de contrat" defaultValue="">
            <option value="">Tous les types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="STAGE">Stage</option>
            <option value="FREELANCE">Freelance</option>
            <option value="ALTERNANCE">Alternance</option>
          </Select>
          <Textarea id="sg-desc" label="Description" hint="Minimum 100 caractères requis." />
        </div>
      </Section>

      <Section title="Badges et pastilles">
        <div className="styleguide-row">
          <Badge>Recruteur</Badge>
          <StatusPill status="EN_ATTENTE" />
          <StatusPill status="ACCEPTEE" />
          <StatusPill status="REFUSEE" />
          <StatusPill active />
          <StatusPill active={false} />
        </div>
      </Section>

      <Section title="Tableau">
        <Table
          columns={[
            { key: "nom", label: "Nom" },
            { key: "email", label: "Email" },
            { key: "role", label: "Rôle" },
            { key: "statut", label: "Statut" },
          ]}
        >
          <tr>
            <td>Dupont Marie</td>
            <td>marie.dupont@exemple.fr</td>
            <td>Candidat</td>
            <td>
              <StatusPill status="EN_ATTENTE" />
            </td>
          </tr>
          <tr>
            <td>Martin Paul</td>
            <td>paul.martin@exemple.fr</td>
            <td>Recruteur</td>
            <td>
              <StatusPill active />
            </td>
          </tr>
        </Table>
      </Section>

      <Section title="Pagination">
        <Pagination
          page={page}
          totalPages={7}
          size={size}
          onPageChange={setPage}
          onSizeChange={setSize}
        />
      </Section>

      <Section title="Onglets">
        <Tabs
          tabs={[
            { value: "toutes", label: "Toutes", count: 12 },
            { value: "en-attente", label: "En attente", count: 5 },
            { value: "acceptees", label: "Acceptées", count: 4 },
            { value: "refusees", label: "Refusées", count: 3 },
          ]}
          active={tab}
          onChange={setTab}
        />
      </Section>

      <Section title="États">
        <div className="styleguide-grid">
          <Skeleton lines={4} />
          <EmptyState
            title="Aucune offre"
            message="Aucune offre ne correspond à ces critères."
            action={<Button>Réinitialiser les filtres</Button>}
          />
          <ErrorState message="Impossible de joindre le serveur." onRetry={() => undefined} />
        </div>
      </Section>

      <Section title="Modales">
        <div className="styleguide-row">
          <Button onClick={() => setModalOpen(true)}>Ouvrir une modale</Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Supprimer
          </Button>
        </div>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Modale d'exemple"
          footer={
            <>
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setModalOpen(false)}>Valider</Button>
            </>
          }
        >
          <p>
            Une modale sert aux confirmations et aux formulaires fugaces. Fermeture par Échap,
            piège de focus, fond d&apos;ombre.
          </p>
        </Modal>

        <ConfirmDialog
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => setConfirmOpen(false)}
          title="Supprimer l'offre"
          message="Voulez-vous vraiment supprimer l'offre « Développeur React confirmé » ? Cette action est irréversible."
          confirmLabel="Supprimer l'offre"
        />
      </Section>

      <Section title="Dépôt de fichier">
        <FileUpload
          fileName={fileName}
          onChange={(file, error) => {
            setFileName(file ? file.name : null);
            setUploadError(error);
          }}
          error={uploadError}
        />
      </Section>

      <Section title="Cartes">
        <div className="styleguide-grid">
          <JobCard offre={SAMPLE_OFFRE} />
          <StatCard label="Offres actives" value={42} hint="+ 6 cette semaine" />
        </div>
      </Section>

      <Section title="Recherche, filtres et jetons">
        <div className="styleguide-grid">
          <div>
            <SearchBar value="" onChange={() => undefined} />
          </div>
          <FilterPanel title="Filtres">
            <Select id="sg-f-type" label="Type de contrat">
              <option value="">Tous</option>
              <option value="CDI">CDI</option>
            </Select>
          </FilterPanel>
          <ActiveFilterChips
            filters={chips}
            onRemove={(key) => setChips(chips.filter((c) => c.key !== key))}
            onClear={() => setChips([])}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="styleguide-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}